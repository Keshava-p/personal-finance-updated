import { cn } from '@/lib/utils';
import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        'flex items-center gap-1',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
