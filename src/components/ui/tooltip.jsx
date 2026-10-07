export function TooltipProvider({ children }) { return children }
export function Tooltip({ content, children }) { return <span className="ui-tooltip" data-tooltip={content} title={content}>{children}</span> }
