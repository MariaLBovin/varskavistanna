 type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

 export interface IButtonProps  {
    variant: ButtonVariant,
    text?: string,
    icon?: JSX.Element
    onClick: () => void
 }