import { ForwardedRef } from "react";

export interface IInputProps {
    label?: string,
    placeholder: string,
    onSubmit: (address: string) => void,
    ref: ForwardedRef<HTMLInputElement>
}