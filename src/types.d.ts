declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        isAuthenticated: boolean;
      };
    }
  }
}

declare global {
  interface Window {
    __PRELOADED_QUERY_STATE__?: DehydratedState;
  }
}

export {};
