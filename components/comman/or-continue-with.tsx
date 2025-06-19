import { cn } from '@/lib/utils';
import * as React from 'react';


export function OrContinueWith({
  className,
  content = "Or continue with",
  ...other
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <p
      className={cn(
        'flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
        className
      )}
      {...other}
    >
      {content}
    </p>
  );
}
