import { useState, useCallback } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

// Mock orders that need design uploads
const pendingOrders = [
  { id: '1', order_number: 'PC-ABC123', product: 'Premium Wall Calendar' },
  { id: '2', order_number: 'PC-DEF456', product: 'Corporate Diary' },
]

function DesignUpload() {
  const [selectedOrder, setSelectedOrder] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [notes, setNotes] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/postscript']
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`)
        return false
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 50MB limit`)
        return false
      }
      return true
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    // Simulate upload progress
    uploadedFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + 10, 100)
            return {
              ...file,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading',
            }
          }
          return file
        })
      )
    }, 200)

    setTimeout(() => clearInterval(interval), 2500)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleSubmit = async () => {
    if (!selectedOrder) {
      toast.error('Please select an order')
      return
    }
    if (files.length === 0) {
      toast.error('Please upload at least one design file')
      return
    }
    if (files.some((f) => f.status !== 'completed')) {
      toast.error('Please wait for all files to finish uploading')
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Design files submitted successfully!')
      setFiles([])
      setSelectedOrder('')
      setNotes('')
    } catch {
      toast.error('Failed to submit design files')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Design</h1>
        <p className="text-muted-foreground">
          Upload your design files for your orders
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Order</CardTitle>
              <CardDescription>
                Choose the order you want to upload designs for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {pendingOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number} - {order.product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Design Files</CardTitle>
              <CardDescription>
                Upload your design files (PDF, AI, PSD, PNG, JPEG)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  Drag and drop your files here
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.ai,.psd"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <File className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.status === 'uploading' && (
                          <Progress value={file.progress} className="mt-2 h-1" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific instructions or notes about your design..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || files.length === 0}
                className="w-full"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Design Files
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Design Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium">Accepted Formats</h4>
                <p className="text-muted-foreground">
                  PDF, AI, PSD, PNG, JPEG (max 50MB each)
                </p>
              </div>
              <div>
                <h4 className="font-medium">Resolution</h4>
                <p className="text-muted-foreground">
                  Minimum 300 DPI for print quality
                </p>
              </div>
              <div>
                <h4 className="font-medium">Color Mode</h4>
                <p className="text-muted-foreground">
                  CMYK for best color accuracy
                </p>
              </div>
              <div>
                <h4 className="font-medium">Bleed Area</h4>
                <p className="text-muted-foreground">
                  Include 3mm bleed on all sides
                </p>
              </div>
              <div>
                <h4 className="font-medium">Fonts</h4>
                <p className="text-muted-foreground">
                  Convert to outlines or embed fonts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DesignUpload
