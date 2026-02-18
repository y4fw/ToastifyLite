const DefaultPosition = 'bottom-right'

const Positions = {
  topLeft: 'top-left',
  topCenter: 'top-center',
  topRight: 'top-right',
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center',
  bottomRight: 'bottom-right',
}

const StyleMap = {
  success: { background: '#1a1a2e', border: '1px solid #22c55e', icon: '✓', iconColor: '#22c55e' },
  error: { background: '#1a1a2e', border: '1px solid #ef4444', icon: '✕', iconColor: '#ef4444' },
  warning: { background: '#1a1a2e', border: '1px solid #f59e0b', icon: '⚠', iconColor: '#f59e0b' },
  info: { background: '#1a1a2e', border: '1px solid #3b82f6', icon: 'i', iconColor: '#3b82f6' },
}

let ActiveContainer = null
let CurrentPosition = DefaultPosition

function injectStyles() {
  if (document.getElementById('toastify-lite-styles')) return

  const StyleElement = document.createElement('style')
  StyleElement.id = 'toastify-lite-styles'
  StyleElement.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

    .toastify-container {
      position: fixed;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      font-family: 'JetBrains Mono', monospace;
    }

    .toastify-container.top-left { top: 20px; left: 20px; align-items: flex-start; }
    .toastify-container.top-center { top: 20px; left: 50%; transform: translateX(-50%); align-items: center; }
    .toastify-container.top-right { top: 20px; right: 20px; align-items: flex-end; }
    .toastify-container.bottom-left { bottom: 20px; left: 20px; align-items: flex-start; flex-direction: column-reverse; }
    .toastify-container.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }
    .toastify-container.bottom-right { bottom: 20px; right: 20px; align-items: flex-end; flex-direction: column-reverse; }

    .toastify-toast {
      pointer-events: all;
      min-width: 280px;
      max-width: 380px;
      padding: 14px 18px;
      border-radius: 8px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      animation: toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      backdrop-filter: blur(8px);
    }

    .toastify-toast.removing {
      animation: toastSlideOut 0.25s ease-in forwards;
    }

    .toastify-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      flex-shrink: 0;
      margin-top: 1px;
      border: 1.5px solid currentColor;
    }

    .toastify-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .toastify-title {
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
      letter-spacing: 0.02em;
    }

    .toastify-message {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      letter-spacing: 0.01em;
    }

    .toastify-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
      transform-origin: left;
      animation: toastProgress linear forwards;
    }

    .toastify-close {
      background: none;
      border: none;
      color: #475569;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
      transition: color 0.2s;
      font-family: inherit;
    }

    .toastify-close:hover {
      color: #94a3b8;
    }

    @keyframes toastSlideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes toastSlideOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(8px) scale(0.95); }
    }

    @keyframes toastProgress {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }
  `
  document.head.appendChild(StyleElement)
}

function getContainer(Position) {
  if (ActiveContainer && ActiveContainer.className.includes(Position)) {
    return ActiveContainer
  }

  if (ActiveContainer) {
    ActiveContainer.remove()
  }

  const Container = document.createElement('div')
  Container.className = `toastify-container ${Position}`
  document.body.appendChild(Container)
  ActiveContainer = Container
  return Container
}

function removeToast(ToastElement) {
  ToastElement.classList.add('removing')
  ToastElement.addEventListener('animationend', () => ToastElement.remove(), { once: true })
}

function createToast(Options) {
  injectStyles()

  const Position = Options.position || CurrentPosition
  const Duration = Options.duration ?? 4000
  const Container = getContainer(Position)

  const ToastElement = document.createElement('div')
  ToastElement.className = 'toastify-toast'

  const InlineStyle = {
    background: Options.background || '#1a1a2e',
    border: Options.border || '1px solid #334155',
    ...Options.style,
  }

  Object.assign(ToastElement.style, InlineStyle)

  const IconElement = document.createElement('div')
  IconElement.className = 'toastify-icon'
  IconElement.style.color = Options.iconColor || '#64748b'
  IconElement.textContent = Options.icon || '•'

  const BodyElement = document.createElement('div')
  BodyElement.className = 'toastify-body'

  if (Options.title) {
    const TitleElement = document.createElement('div')
    TitleElement.className = 'toastify-title'
    TitleElement.textContent = Options.title
    BodyElement.appendChild(TitleElement)
  }

  const MessageElement = document.createElement('div')
  MessageElement.className = 'toastify-message'
  MessageElement.style.color = Options.title ? '#94a3b8' : '#f1f5f9'
  MessageElement.textContent = Options.message

  BodyElement.appendChild(MessageElement)

  const CloseButton = document.createElement('button')
  CloseButton.className = 'toastify-close'
  CloseButton.textContent = '✕'
  CloseButton.addEventListener('click', (e) => {
    e.stopPropagation()
    removeToast(ToastElement)
  })

  ToastElement.appendChild(IconElement)
  ToastElement.appendChild(BodyElement)
  ToastElement.appendChild(CloseButton)

  if (Duration > 0) {
    const ProgressBar = document.createElement('div')
    ProgressBar.className = 'toastify-progress'
    ProgressBar.style.background = Options.iconColor || '#64748b'
    ProgressBar.style.animationDuration = `${Duration}ms`
    ToastElement.appendChild(ProgressBar)

    setTimeout(() => removeToast(ToastElement), Duration)
  }

  ToastElement.addEventListener('click', () => removeToast(ToastElement))

  Container.appendChild(ToastElement)

  return ToastElement
}

function toast(Message, Options = {}) {
  return createToast({ message: Message, ...Options })
}

toast.success = function (Message, Options = {}) {
  const Config = StyleMap.success
  return createToast({ message: Message, ...Config, ...Options })
}

toast.error = function (Message, Options = {}) {
  const Config = StyleMap.error
  return createToast({ message: Message, ...Config, ...Options })
}

toast.warning = function (Message, Options = {}) {
  const Config = StyleMap.warning
  return createToast({ message: Message, ...Config, ...Options })
}

toast.info = function (Message, Options = {}) {
  const Config = StyleMap.info
  return createToast({ message: Message, ...Config, ...Options })
}

toast.custom = function (Options = {}) {
  return createToast(Options)
}

toast.setPosition = function (Position) {
  CurrentPosition = Position
}

toast.positions = Positions

export { toast, Positions }
export default toast
