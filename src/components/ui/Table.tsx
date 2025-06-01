import React from "react"

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  children: React.ReactNode
  className?: string
}

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  children: React.ReactNode
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  children: React.ReactNode
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  children: React.ReactNode
  header?: boolean
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <table
      className={`w-full ${className ?? ""}`}
      {...props}
    >
      {children}
    </table>
  )
}

export function TableHead({ children, ...props }: TableHeadProps) {
  return (
    <thead
      className="align-left"
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableRow({ children, ...props }: TableRowProps) {
  return <tr {...props}>{children}</tr>
}

export function TableCell({
  children,
  header = false,
  className,
  ...props
}: TableCellProps) {
  const baseClass = "px-3 py-2 text-left"
  if (header) {
    return (
      <th
        className={`${baseClass} font-semibold ${className ?? ""}`}
        {...props}
      >
        {children}
      </th>
    )
  }
  return (
    <td
      className={`${baseClass} ${className ?? ""}`}
      {...props}
    >
      {children}
    </td>
  )
}
