 type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';

 export interface IButtonProps  {
    variant: ButtonVariant,
    text?: string,
    icon?: JSX.Element,
    onClick: () => void,
 }