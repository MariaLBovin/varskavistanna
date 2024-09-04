import { ChangeEvent, ForwardedRef } from "react";

export interface IInputProps {
    label?: string,
    placeholder: string,
    value? :string,
    onSubmit: (value: string) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: ForwardedRef<HTMLInputElement>
    readOnly?:boolean
    onClick?: () => void
}