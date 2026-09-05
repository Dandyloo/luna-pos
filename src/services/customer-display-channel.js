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

export function publishCustomerDraft(draft) {
  const activeChannel = getChannel()

  if (!activeChannel) {
    return false
  }

  activeChannel.postMessage({
    type: 'ACTIVE_DRAFT',
    payload: draft,
  })

  return true
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

export function subscribeToCustomerDrafts(callback) {
  const activeChannel = getChannel()

  if (!activeChannel) {
    return () => {}
  }

  const handleMessage = (event) => {
    const message = event.data

    if (message?.type === 'ACTIVE_DRAFT') {
      callback(message.payload || null)
    }
  }

  activeChannel.addEventListener('message', handleMessage)

  return () => {
    activeChannel.removeEventListener('message', handleMessage)
  }
}