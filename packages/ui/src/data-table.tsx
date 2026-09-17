'use client';
import { useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from 'lucide-react';
import { Button } from '@avastar/ui/components/button';
import { Input } from '@avastar/ui/components/input';
import { Checkbox } from '@avastar/ui/components/checkbox';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@avastar/ui/components/table';
import { Pagination, PaginationContent, PaginationItem } from '@avastar/ui/components/pagination';
import { Skeleton } from '@avastar/ui/components/skeleton';
import { translate, type Locale } from '@avastar/ui/lib/locale';
export type Column<T> = {
  id: string;
  label: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
};
export type DataTableProps<T extends { id: string }> = {
  rows: T[];
  columns: Column<T>[];
  locale: Locale;
  caption: string;
  searchText: (row: T) => string;
  rowLabel: (row: T) => string;
  toolbar?: ReactNode;
  pageSize?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onBulkAction?: (rows: T[]) => void;
  selectionResetKey?: number;
  emptyKind?: 'empty' | 'no-results';
};
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  locale,
  caption,
  searchText,
  rowLabel,
  toolbar,
  pageSize = 5,
  loading = false,
  error,
  onRetry,
  onBulkAction,
  selectionResetKey = 0,
  emptyKind = 'empty',
}: DataTableProps<T>) {
  const t = translate(locale),
    [query, setQuery] = useState(''),
    [page, setPage] = useState(1),
    [sort, setSort] = useState<{ id: string; descending: boolean } | null>(null),
    [selection, setSelection] = useState<{ key: number; ids: string[] }>({
      key: selectionResetKey,
      ids: [],
    });
  const selected = selection.key === selectionResetKey ? selection.ids : [];
  const filtered = useMemo(() => {
    let result = rows.filter((row) =>
      searchText(row).toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)),
    );
    const column = columns.find((item) => item.id === sort?.id);
    if (column?.sortValue && sort) {
      const value = column.sortValue;
      result = [...result].sort((a, b) => {
        const aa = value(a),
          bb = value(b);
        return (
          (typeof aa === 'number' && typeof bb === 'number'
            ? aa - bb
            : String(aa).localeCompare(String(bb), locale)) * (sort.descending ? -1 : 1)
        );
      });
    }
    return result;
  }, [rows, columns, query, sort, searchText, locale]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    currentPage = Math.min(page, pages),
    visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    selectedRows = filtered.filter((row) => selected.includes(row.id));
  const allPageSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id)),
    somePageSelected = visible.some((row) => selected.includes(row.id));
  function select(ids: string[]) {
    setSelection({ key: selectionResetKey, ids });
  }
  return (
    <div className="av-data-table av-card">
      <div className="table-toolbar">
        <div className="table-search">
          <Search size={18} />
          <Input
            className="av-field"
            aria-label={t('جست‌وجو در جدول', 'Search table')}
            placeholder={t('جست‌وجو در نام یا شناسه…', 'Search name or ID…')}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
              select([]);
            }}
          />
          {query && (
            <Button
              className="av-button av-button--ghost av-button--icon"
              aria-label={t('پاک‌کردن جست‌وجو', 'Clear search')}
              onClick={() => {
                setQuery('');
                setPage(1);
              }}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        {toolbar}
      </div>
      {!loading && !error && selectedRows.length > 0 && (
        <div className="table-selection" role="status">
          <span>
            {new Intl.NumberFormat(locale).format(selectedRows.length)}{' '}
            {t('ردیف انتخاب شده', 'rows selected')}
          </span>
          <Button className="av-button av-button--ghost av-button--sm" onClick={() => select([])}>
            {t('لغو انتخاب', 'Clear selection')}
          </Button>
          {onBulkAction && (
            <Button
              className="av-button av-button--secondary av-button--sm"
              onClick={() => onBulkAction(selectedRows)}
            >
              {t('بایگانی انتخاب‌ها', 'Archive selected')}
            </Button>
          )}
        </div>
      )}
      {error ? (
        <div className="table-empty" role="alert">
          <h3>{t('دریافت اطلاعات ممکن نشد', 'Could not load records')}</h3>
          <p>{error}</p>
          {onRetry && (
            <Button className="av-button av-button--secondary" onClick={onRetry}>
              {t('تلاش دوباره', 'Try again')}
            </Button>
          )}
        </div>
      ) : (
        <Table aria-label={caption} aria-busy={loading}>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              <TableHead className="table-check">
                <Checkbox
                  aria-label={t('انتخاب ردیف‌های این صفحه', 'Select rows on this page')}
                  checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
                  disabled={loading || !visible.length}
                  onCheckedChange={(value) =>
                    select(
                      value === true
                        ? [...new Set([...selected, ...visible.map((row) => row.id)])]
                        : selected.filter((id) => !visible.some((row) => row.id === id)),
                    )
                  }
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  scope="col"
                  aria-sort={
                    sort?.id === column.id
                      ? sort.descending
                        ? 'descending'
                        : 'ascending'
                      : undefined
                  }
                >
                  {column.sortValue ? (
                    <button
                      className="table-sort"
                      onClick={() => {
                        setSort({
                          id: column.id,
                          descending: sort?.id === column.id ? !sort.descending : false,
                        });
                        setPage(1);
                      }}
                    >
                      {column.label}
                      {sort?.id === column.id ? (
                        sort.descending ? (
                          <ArrowDown size={14} />
                        ) : (
                          <ArrowUp size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: columns.length + 1 }, (_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : visible.length ? (
              visible.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selected.includes(row.id) ? 'selected' : undefined}
                >
                  <TableCell className="table-check">
                    <Checkbox
                      aria-label={t('انتخاب ', 'Select ') + rowLabel(row)}
                      checked={selected.includes(row.id)}
                      onCheckedChange={(value) =>
                        select(
                          value === true
                            ? [...selected, row.id]
                            : selected.filter((id) => id !== row.id),
                        )
                      }
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.cell(row)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <div className="table-empty">
                    <Search size={28} />
                    <h3>
                      {query || emptyKind === 'no-results'
                        ? t('نتیجه‌ای پیدا نشد', 'No results found')
                        : t('رکوردی برای نمایش نیست', 'No records to display')}
                    </h3>
                    <p>
                      {t(
                        'عبارت جست‌وجو یا فیلتر را تغییر دهید.',
                        'Change the search term or filter.',
                      )}
                    </p>
                    {query && (
                      <Button
                        className="av-button av-button--secondary av-button--sm"
                        onClick={() => {
                          setQuery('');
                          setPage(1);
                        }}
                      >
                        {t('پاک‌کردن جست‌وجو', 'Clear search')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <footer className="table-footer">
        <span role="status">
          {new Intl.NumberFormat(locale).format(filtered.length)}{' '}
          {t('رکورد نمونه', 'sample records')}
        </span>
        <Pagination aria-label={t('صفحه‌های جدول', 'Table pages')}>
          <PaginationContent>
            <PaginationItem>
              <Button
                className="av-button av-button--ghost av-button--sm"
                disabled={currentPage <= 1 || loading || !!error}
                onClick={() => setPage(currentPage - 1)}
              >
                {t('قبلی', 'Previous')}
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="table-page" aria-live="polite">
                {new Intl.NumberFormat(locale).format(currentPage)} /{' '}
                {new Intl.NumberFormat(locale).format(pages)}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                className="av-button av-button--ghost av-button--sm"
                disabled={currentPage >= pages || loading || !!error}
                onClick={() => setPage(currentPage + 1)}
              >
                {t('بعدی', 'Next')}
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </div>
  );
}
