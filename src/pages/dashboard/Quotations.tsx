import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Eye, CheckCircle, XCircle, MoreVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate, getStatusColor } from '@/utils/helpers'
import { toast } from 'sonner'

// Mock data
const mockQuotations = [
  {
    id: '1',
    quotation_number: 'QT-XYZ123',
    status: 'sent',
    total: 15000,
    valid_until: '2024-02-15',
    created_at: '2024-01-20',
    items: [
      { product_name: 'Corporate Diary', quantity: 100 },
      { product_name: 'Desk Calendar', quantity: 50 },
    ],
  },
  {
    id: '2',
    quotation_number: 'QT-XYZ456',
    status: 'accepted',
    total: 8500,
    valid_until: '2024-02-10',
    created_at: '2024-01-15',
    items: [{ product_name: 'Premium Notebooks', quantity: 200 }],
  },
  {
    id: '3',
    quotation_number: 'QT-XYZ789',
    status: 'draft',
    total: 25000,
    valid_until: '2024-02-20',
    created_at: '2024-01-22',
    items: [
      { product_name: 'Wedding Invitations', quantity: 500 },
      { product_name: 'Thank You Cards', quantity: 500 },
    ],
  },
  {
    id: '4',
    quotation_number: 'QT-ABC123',
    status: 'expired',
    total: 12000,
    valid_until: '2024-01-10',
    created_at: '2024-01-01',
    items: [{ product_name: 'Wall Calendar', quantity: 150 }],
  },
]

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' },
]

function Quotations() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredQuotations = mockQuotations.filter((quote) => {
    const matchesSearch =
      quote.quotation_number.toLowerCase().includes(search.toLowerCase()) ||
      quote.items.some((item) =>
        item.product_name.toLowerCase().includes(search.toLowerCase())
      )
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAccept = (id: string) => {
    toast.success('Quotation accepted! Order will be created.')
  }

  const handleReject = (id: string) => {
    toast.info('Quotation rejected.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Manage and review your quotation requests
          </p>
        </div>
        <Button asChild>
          <Link to="/contact">
            <Plus className="mr-2 h-4 w-4" />
            Request Quote
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quotations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredQuotations.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No quotations found</p>
              <Button className="mt-4" asChild>
                <Link to="/contact">Request a Quote</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">
                      {quote.quotation_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        {quote.items.map((item, idx) => (
                          <p key={idx} className={idx > 0 ? 'text-sm text-muted-foreground' : ''}>
                            {item.product_name} x {item.quantity}
                          </p>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(quote.created_at)}</TableCell>
                    <TableCell>{formatDate(quote.valid_until)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(quote.total)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/quotations/${quote.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {quote.status === 'sent' && (
                            <>
                              <DropdownMenuItem onClick={() => handleAccept(quote.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Quote
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(quote.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Quote
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Quotations
