import { toast as sonnerToast } from 'sonner'

// Minimal types to keep compatibility without depending on shadcn's toast types
type ToasterToast = {
    id?: string
    title?: React.ReactNode
    description?: React.ReactNode
    // keep action as unknown to preserve call-sites that might pass it
    action?: unknown
}

type Toast = Omit<ToasterToast, 'id'> & { variant?: string }

let count = 0
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

const mapVariant = (variant?: string) => {
    switch (variant) {
        case 'destructive':
            return 'error'
        case 'success':
            return 'success'
        case 'warning':
            return 'warning'
        default:
            return 'default'
    }
}

function toast({ title, description, variant }: Toast) {
    const id = genId()

    const content = title || description || ''

    const level = mapVariant(variant)

    if (level === 'error') {
        sonnerToast.error(content as any, { id })
    } else if (level === 'success') {
        sonnerToast.success(content as any, { id })
    } else if (level === 'warning') {
        sonnerToast(content as any, { id })
    } else {
        sonnerToast(content as any, { id })
    }

    return {
        id,
        dismiss: () => sonnerToast.dismiss?.(id),
        update: (props: ToasterToast) => {
            // sonner doesn't support update; emulate by dismissing and showing new
            sonnerToast.dismiss?.(id)
            const newId = genId()
            sonnerToast((props.title || props.description) as any, { id: newId })
            return newId
        },
    }
}

function useToast() {
    return {
        toast,
        dismiss: (id?: string) => sonnerToast.dismiss?.(id),
    }
}

export { useToast, toast }