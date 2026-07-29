import { CoralogixRum, CoralogixDomain } from '@coralogix/browser';

const {
  NEXT_PUBLIC_CORALOGIX_RUM_PUBLIC_KEY = '',
  NEXT_PUBLIC_CORALOGIX_RUM_APPLICATION_NAME = '',
  NEXT_PUBLIC_CORALOGIX_RUM_APPLICATION_VERSION = '',
  NEXT_PUBLIC_CORALOGIX_RUM_DOMAIN = '',
} = typeof window !== 'undefined' ? window.ENV : {};

interface Session {
  userId: string;
}

const InitCoralogixRum = (session?: Session) => {
  if (!NEXT_PUBLIC_CORALOGIX_RUM_PUBLIC_KEY) {
    return;
  }

  CoralogixRum.init({
    public_key: NEXT_PUBLIC_CORALOGIX_RUM_PUBLIC_KEY,
    application: NEXT_PUBLIC_CORALOGIX_RUM_APPLICATION_NAME,
    version: NEXT_PUBLIC_CORALOGIX_RUM_APPLICATION_VERSION,
    coralogixDomain: NEXT_PUBLIC_CORALOGIX_RUM_DOMAIN as CoralogixDomain,
    user_context: session
      ? {
          user_id: session.userId,
          user_name: `guest-${session.userId}`,
        }
      : undefined,
    sessionRecordingConfig: {
      enable: true,
      autoStartSessionRecording: true,
    },
    traceParentInHeader: {
      enabled: true,
      options: {
        // Scope header injection to this app's own backend calls only, so the
        // trace header isn't attached to the RUM SDK's own requests to the
        // Coralogix ingress endpoint (which rejects the extra CORS header).
        allowedTracingUrls: [new RegExp(`^${window.location.origin}`)],
      },
    },
  });
};

export default InitCoralogixRum;
