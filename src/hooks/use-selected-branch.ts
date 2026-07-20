// ma-nees
import { useEffect, useState } from "react";

export const ALL_BRANCHES = "all";

const STORAGE_KEY = "drivesiksha:selected-branch";
const CHANGE_EVENT = "drivesiksha:selected-branch-change";

export function getStoredBranchId() {
  if (typeof window === "undefined") return ALL_BRANCHES;

  return window.localStorage.getItem(STORAGE_KEY) || ALL_BRANCHES;
}

export function useSelectedBranch() {
  const [branchId, setBranchIdState] = useState(ALL_BRANCHES);

  useEffect(() => {
    const syncBranch = () => setBranchIdState(getStoredBranchId());

    syncBranch();
    window.addEventListener("storage", syncBranch);
    window.addEventListener(CHANGE_EVENT, syncBranch);

    return () => {
      window.removeEventListener("storage", syncBranch);
      window.removeEventListener(CHANGE_EVENT, syncBranch);
    };
  }, []);

  const setBranchId = (nextBranchId: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextBranchId);
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }

    setBranchIdState(nextBranchId);
  };

  return [branchId, setBranchId] as const;
}

