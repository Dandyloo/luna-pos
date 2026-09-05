const CHANNEL_NAME = 'luna-customer-display-channel'

let channel = null
let currentDraftProvider = null

function getChannel() {
  if (!('BroadcastChannel' in window)) {
    return null
  }

  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME)
  }

  return channel
}

export function initializeCustomerDisplayChannel({ getCurrentDraft } = {}) {
  currentDraftProvider = getCurrentDraft || null

  const activeChannel = getChannel()

  if (!activeChannel) {
    return false
  }

  activeChannel.onmessage = (event) => {
    const message = event.data

    if (message?.type === 'REQUEST_ACTIVE_DRAFT' && currentDraftProvider) {
      activeChannel.postMessage({
        type: 'ACTIVE_DRAFT',
        payload: currentDraftProvider(),
      })
    }
  }

  return true
}

export function publishCustomerDisplayMessage(type, payload = null) {
  const activeChannel = getChannel()

  if (!activeChannel) {
    return false
  }

  activeChannel.postMessage({
    type,
    payload,
  })

  return true
}

export function publishCustomerDraft(draft) {
  return publishCustomerDisplayMessage('ACTIVE_DRAFT', draft)
}

export function publishSubmittedOrder(order) {
  return publishCustomerDisplayMessage('ORDER_SUBMITTED', order)
}

export function publishReadyOrder(order) {
  return publishCustomerDisplayMessage('ORDER_READY', order)
}

export function clearCustomerDisplay() {
  return publishCustomerDisplayMessage('CLEAR_DISPLAY')
}

export function requestActiveCustomerDraft() {
  const activeChannel = getChannel()

  if (!activeChannel) {
    return false
  }

  activeChannel.postMessage({
    type: 'REQUEST_ACTIVE_DRAFT',
  })

  return true
}

export function subscribeToCustomerDisplayMessages(callback) {
  const activeChannel = getChannel()

  if (!activeChannel) {
    return () => {}
  }

  const handleMessage = (event) => {
    const message = event.data

    if (
      message?.type === 'ACTIVE_DRAFT' ||
      message?.type === 'ORDER_SUBMITTED' ||
      message?.type === 'ORDER_READY' ||
      message?.type === 'CLEAR_DISPLAY'
    ) {
      callback(message)
    }
  }

  activeChannel.addEventListener('message', handleMessage)

  return () => {
    activeChannel.removeEventListener('message', handleMessage)
  }
}