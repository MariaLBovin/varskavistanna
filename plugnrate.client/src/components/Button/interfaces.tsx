 type ButtonVariant = 'primary' | 'secondary';

 export interface IButtonProps  {
    variant: ButtonVariant,
    text: string,
    onClick: () => void
 }