import PromiseCanceledError from "@mgtitimoli/utils-promise/dist/PromiseCanceledError";
import * as withCancelablePromise from "@mgtitimoli/utils-promise/dist/cancelablePromise";
import {promiseStatuses} from "@mgtitimoli/utils-promise/dist/promiseStatus";
import {useEffect, useState} from "react";

import type {SetStateFrom} from "@mgtitimoli/react-state";

import * as withUsePromiseState from "./usePromiseState";

import type {UsePromiseState} from "./usePromiseState";

type SetUsePromiseState<TResult> = SetStateFrom<UsePromiseState<TResult>>;

const onPromiseRejected = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>
) => (error: Error) => {
  if (!(error instanceof PromiseCanceledError)) {
    setUsePromiseState(withUsePromiseState.createRejected(error));
  }
};

const onPromiseFulfilled = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>
) => (result: TResult) =>
  setUsePromiseState(withUsePromiseState.createFulfilled(result));

const initialUsePromiseState = withUsePromiseState.createIdle();

const usePromise = <TResult>(
  createPromise: () => Promise<TResult>,
  dependencies: Array<unknown> = []
) => {
  const [usePromiseState, setUsePromiseState] = useState<
    UsePromiseState<TResult>
  >(initialUsePromiseState);

  useEffect(() => {
    setUsePromiseState(withUsePromiseState.createPending);

    const {cancel, promise} = withCancelablePromise.create(createPromise());

    promise
      .then(onPromiseFulfilled(setUsePromiseState))
      .catch(onPromiseRejected(setUsePromiseState));

    return cancel;
  }, dependencies);

  return usePromiseState;
};

usePromise.stateStatuses = promiseStatuses;

export default usePromise;
