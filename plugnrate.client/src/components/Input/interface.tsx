import { ChangeEvent, ForwardedRef } from "react";

export interface IInputProps {
    label?: string,
    placeholder: string,
    value? :string,
    isEmpty: boolean,
    onSubmit?: (value: string) => void,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    ref: ForwardedRef<HTMLInputElement>
    readOnly?:boolean
    onClick?: () => void
}