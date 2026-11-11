/**
 * Поведение формы заявки: маска телефона, проверка полей, отправка
 * в Web3Forms (письмо на help@smartsol.pro) и сообщение об успехе.
 * Сайт статический, своего сервера нет: заявку принимает Web3Forms,
 * ключ доступа — PUBLIC_WEB3FORMS_KEY (по задумке сервиса он публичный,
 * лишние адреса отсекаются привязкой ключа к домену в кабинете Web3Forms).
 * Защита от спама: скрытое поле-ловушка. Без сторонних библиотек.
 */
import { trackGoal } from './analytics';
import { getAttribution } from './attribution';

const ENDPOINT = 'https://api.web3forms.com/submit';

type CheckKey = 'name' | 'phone' | 'task' | 'consent';
type MessageKey =
  | CheckKey
  | 'summary'
  | 'network'
  | 'whatsapp'
  | 'server'
  | 'sending'
  | 'waTemplate'
  | 'waName'
  | 'waPhone'
  | 'waCompany'
  | 'waTask'
  | 'mailSubject';
type Messages = Record<MessageKey, string>;

// ── Телефон: +7 (XXX) XXX-XX-XX ──

const PREFIX = '+7 (';

/** Национальная часть номера (10 цифр без +7). Понимает 8…, +7…, 7… при вставке */
export function nationalDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (value.trim().startsWith('+7')) digits = digits.slice(1);
  else if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
  // Номера в Казахстане после +7 не начинаются с 8 — это «восьмёрка» по привычке
  if (digits.startsWith('8')) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function formatPhone(digits: string): string {
  if (!digits) return '';
  let out = PREFIX + digits.slice(0, 3);
  if (digits.length >= 3) out += ')';
  if (digits.length > 3) out += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) out += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) out += `-${digits.slice(8, 10)}`;
  return out;
}

function setupPhoneMask(input: HTMLInputElement): void {
  const apply = (digits: string, caretDigits: number) => {
    const focused = document.activeElement === input;
    const value = digits ? formatPhone(digits) : focused ? PREFIX : '';
    input.value = value;
    if (!focused) return;
    // Курсор — сразу после нужной по счёту цифры
    let caret = value.length;
    if (caretDigits === 0) caret = Math.min(PREFIX.length, value.length);
    else {
      let count = 0;
      for (let i = PREFIX.length; i < value.length; i++) {
        if (/\d/.test(value[i]) && ++count === caretDigits) {
          caret = i + 1;
          break;
        }
      }
    }
    input.setSelectionRange(caret, caret);
  };

  input.addEventListener('focus', () => {
    if (!input.value) apply('', 0);
  });

  input.addEventListener('blur', () => {
    if (!nationalDigits(input.value)) input.value = '';
  });

  input.addEventListener('input', () => {
    const pos = input.selectionStart ?? input.value.length;
    const before = nationalDigits(input.value.slice(0, pos)).length;
    apply(nationalDigits(input.value), before);
  });

  // Backspace сразу после скобки или дефиса удаляет предыдущую цифру
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Backspace') return;
    const start = input.selectionStart ?? 0;
    if (start !== input.selectionEnd || start <= PREFIX.length) return;
    if (/\d/.test(input.value[start - 1])) return;
    event.preventDefault();
    let i = start - 1;
    while (i >= PREFIX.length && !/\d/.test(input.value[i])) i--;
    if (i < PREFIX.length) return;
    const index = nationalDigits(input.value.slice(0, i + 1)).length - 1;
    const digits = nationalDigits(input.value);
    apply(digits.slice(0, index) + digits.slice(index + 1), index);
  });
}

// ── Форма ──

function initForm(form: HTMLFormElement): void {
  const root = form.closest<HTMLElement>('[data-lead-root]')!;
  const success = root.querySelector<HTMLElement>('[data-success]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const messages = JSON.parse(form.dataset.messages ?? '{}') as Messages;
  const locale = form.dataset.locale ?? 'ru';
  const accessKey = form.dataset.key ?? '';

  const nameInput = form.elements.namedItem('name') as HTMLInputElement;
  const phoneInput = form.elements.namedItem('phone') as HTMLInputElement;
  const orgInput = form.elements.namedItem('org') as HTMLInputElement;
  const taskInput = form.elements.namedItem('task') as HTMLTextAreaElement;
  const consentInput = form.elements.namedItem('consent') as HTMLInputElement;
  const honeypot = form.elements.namedItem('website') as HTMLInputElement;
  const submitLabel = submit.textContent ?? '';

  setupPhoneMask(phoneInput);

  // ── Проверка полей (компания — необязательная) ──
  type Check = { key: CheckKey; ok: () => boolean; fields: HTMLElement[]; focus: HTMLElement };
  const checks: Check[] = [
    {
      key: 'name',
      ok: () => nameInput.value.trim().length >= 2,
      fields: [nameInput],
      focus: nameInput,
    },
    {
      key: 'phone',
      ok: () => nationalDigits(phoneInput.value).length === 10,
      fields: [phoneInput],
      focus: phoneInput,
    },
    {
      key: 'task',
      ok: () => taskInput.value.trim().length >= 3 && taskInput.value.length <= 1000,
      fields: [taskInput],
      focus: taskInput,
    },
    {
      key: 'consent',
      ok: () => consentInput.checked,
      fields: [consentInput],
      focus: consentInput,
    },
  ];

  const errorBox = (field: HTMLElement): HTMLElement | null => {
    const describedBy = field.getAttribute('aria-describedby');
    return describedBy ? document.getElementById(describedBy) : null;
  };

  function showError(check: Check, message: string | null): void {
    for (const field of check.fields) {
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
    const box = errorBox(check.fields[0]);
    if (box) {
      box.textContent = message ?? '';
      box.hidden = !message;
    }
  }

  function validate(): Check[] {
    const failed = checks.filter((check) => !check.ok());
    for (const check of checks) showError(check, failed.includes(check) ? messages[check.key] : null);
    return failed;
  }

  let attempted = false;
  form.addEventListener('input', () => attempted && validate());
  form.addEventListener('change', () => attempted && validate());

  const setStatus = (text: string) => {
    status.textContent = text;
  };

  // Запасной путь: та же заявка в WhatsApp, введённые данные уже в тексте
  const whatsappFallback = (): string => {
    const digits = nationalDigits(phoneInput.value);
    const lines = [messages.waTemplate];
    if (form.dataset.topic) lines.push(form.dataset.topic);
    if (nameInput.value.trim()) lines.push(`${messages.waName}: ${nameInput.value.trim()}`);
    if (digits.length === 10) lines.push(`${messages.waPhone}: ${formatPhone(digits)}`);
    if (orgInput.value.trim()) lines.push(`${messages.waCompany}: ${orgInput.value.trim()}`);
    if (taskInput.value.trim()) lines.push(`${messages.waTask}: ${taskInput.value.trim()}`);
    return `https://wa.me/${form.dataset.wa ?? ''}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  /** Ошибка отправки: форма не стирается, можно нажать ещё раз или уйти в WhatsApp */
  const setFailure = (text: string) => {
    status.textContent = `${text} `;
    const link = document.createElement('a');
    link.className = 'u-link';
    link.href = whatsappFallback();
    link.target = '_blank';
    link.rel = 'noopener';
    link.dataset.place = 'form-fallback';
    link.textContent = messages.whatsapp;
    status.append(link);
  };

  const setBusy = (busy: boolean) => {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submit.textContent = busy ? messages.sending : submitLabel;
  };

  const showSuccess = () => {
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  // ── Отправка ──
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    attempted = true;

    const failed = validate();
    if (failed.length) {
      setStatus(messages.summary);
      failed[0].focus.focus();
      return;
    }

    // Ловушка заполнена — это бот: делаем вид, что всё ушло, и ничего не отправляем
    if (honeypot.value.trim()) {
      showSuccess();
      return;
    }

    // Ключа Web3Forms нет (не задан при сборке) — честно предлагаем WhatsApp
    if (!accessKey) {
      setFailure(messages.server);
      return;
    }

    sending = true;
    setBusy(true);
    setStatus('');

    try {
      const attribution = getAttribution();
      const utm = Object.entries(attribution?.utm ?? {})
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join(' · ');
      const phone = formatPhone(nationalDigits(phoneInput.value));
      const topic = form.dataset.topic ?? '';

      // Поля письма — по-русски, в том порядке, в каком их удобно читать
      const payload: Record<string, string | boolean> = {
        access_key: accessKey,
        subject: `${messages.mailSubject}${topic ? `: ${topic}` : ''}`,
        from_name: 'smartsol.pro',
        'Имя': nameInput.value.trim(),
        'Телефон': phone,
        'WhatsApp': `https://wa.me/7${nationalDigits(phoneInput.value)}`,
        'Компания': orgInput.value.trim() || '—',
        'Задача': taskInput.value.trim(),
        'Тема': topic || '—',
        'Язык страницы': locale,
        'Страница': window.location.href.slice(0, 500),
        'UTM': utm || 'нет',
        'Первая страница визита': attribution?.landing ?? '',
        'Пришёл с сайта': attribution?.referrer ?? '',
        botcheck: false,
      };

      let response: Response;
      try {
        response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        setFailure(messages.network);
        return;
      }

      const result = (await response.json().catch(() => ({}))) as { success?: boolean };
      if (response.ok && result.success) {
        trackGoal('lead_submit', { topic, lang: locale });
        showSuccess();
        return;
      }
      setFailure(messages.server);
    } finally {
      sending = false;
      setBusy(false);
    }
  });
}

export function initLeadForms(): void {
  document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach(initForm);
}
