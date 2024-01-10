
import { create } from "zustand"

export type ViewStore = {
    inViewTitle: number | null,
    setInviewTitle: (title_id: number | null) => void
}

export const useViewStore = create<ViewStore>((set) => ({
    inViewTitle: null,
    setInviewTitle: (title_id: number | null) => set(() => ({ inViewTitle: title_id })),
}))