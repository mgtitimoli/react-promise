import {usePromiseStatuses} from "./usePromiseStatus";

type FulfilledUsePromiseState<TResult> = {
  result: TResult;
  status: typeof usePromiseStatuses.fulfilled;
};

type RejectedUsePromiseState = {
  error: Error;
  status: typeof usePromiseStatuses.rejected;
};

type PendingUsePromiseState = {
  status: typeof usePromiseStatuses.pending;
};

type SkippedUsePromiseState = {
  status: typeof usePromiseStatuses.skipped;
};

type IdleUsePromiseState = {
  status: typeof usePromiseStatuses.idle;
};

// We are calling this UsePromiseState and not just State to communicate better
// the result to the user
type UsePromiseState<TResult> =
  | IdleUsePromiseState
  | SkippedUsePromiseState
  | PendingUsePromiseState
  | RejectedUsePromiseState
  | FulfilledUsePromiseState<TResult>;

const createSkipped = () => ({
  status: usePromiseStatuses.skipped
});

const createRejected = (error: Error) => ({
  error,
  status: usePromiseStatuses.rejected
});

const createPending = () => ({
  status: usePromiseStatuses.pending
});

const createFulfilled = <TResult>(result: TResult) => ({
  result,
  status: usePromiseStatuses.fulfilled
});

const createIdle = () => ({
  status: usePromiseStatuses.idle
});

export {
  createIdle,
  createFulfilled,
  createPending,
  createRejected,
  createSkipped
};

export type {
  FulfilledUsePromiseState,
  IdleUsePromiseState,
  PendingUsePromiseState,
  RejectedUsePromiseState,
  SkippedUsePromiseState,
  UsePromiseState
};
