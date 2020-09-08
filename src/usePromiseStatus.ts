import {promiseStatuses} from "@mgtitimoli/utils-promise/dist/promiseStatus";

const usePromiseStatuses = {
  ...promiseStatuses,
  skipped: "skipped"
} as const;

type UsePromiseStatus = typeof usePromiseStatuses[keyof typeof usePromiseStatuses];

export {usePromiseStatuses};

export type {UsePromiseStatus};
