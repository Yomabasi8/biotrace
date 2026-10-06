"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "motion/react";
import type { InterestId } from "@/lib/get-involved";
import { GetInvolvedModal } from "./get-involved-modal";

type Ctx = { open: (interest?: InterestId) => void };

const GetInvolvedContext = createContext<Ctx | null>(null);

// Lets any button on the site open the Get Involved form, optionally preselecting a pathway
export function GetInvolvedProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; interest?: InterestId }>({ open: false });
  const open = useCallback((interest?: InterestId) => setState({ open: true, interest }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <GetInvolvedContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state.open && <GetInvolvedModal key="get-involved" initialInterest={state.interest} onClose={close} />}
      </AnimatePresence>
    </GetInvolvedContext.Provider>
  );
}

export function useGetInvolved() {
  const ctx = useContext(GetInvolvedContext);
  if (!ctx) throw new Error("useGetInvolved must be used inside GetInvolvedProvider");
  return ctx;
}
