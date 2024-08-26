 type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

 export interface IButtonProps  {
    variant: ButtonVariant,
    text?: string,
    onClick: () => void
 }