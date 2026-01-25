export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    parent_id: string | null
                    vertical: 'audio' | 'video' | 'streaming'
                    description: string | null
                    icon: string | null
                    display_order: number | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    parent_id?: string | null
                    vertical: 'audio' | 'video' | 'streaming'
                    description?: string | null
                    icon?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    parent_id?: string | null
                    vertical?: 'audio' | 'video' | 'streaming'
                    description?: string | null
                    icon?: string | null
                    display_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            products: {
                Row: {
                    id: string
                    category_id: string
                    name: string
                    slug: string
                    brand: string | null
                    description: string | null
                    short_description: string | null
                    image_url: string | null
                    gallery_urls: Json | null
                    specs: Json | null
                    pros: Json | null
                    cons: Json | null
                    is_featured: boolean | null
                    is_active: boolean | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    category_id: string
                    name: string
                    slug: string
                    brand?: string | null
                    description?: string | null
                    short_description?: string | null
                    image_url?: string | null
                    gallery_urls?: Json | null
                    specs?: Json | null
                    pros?: Json | null
                    cons?: Json | null
                    is_featured?: boolean | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    category_id?: string
                    name?: string
                    slug?: string
                    brand?: string | null
                    description?: string | null
                    short_description?: string | null
                    image_url?: string | null
                    gallery_urls?: Json | null
                    specs?: Json | null
                    pros?: Json | null
                    cons?: Json | null
                    is_featured?: boolean | null
                    is_active?: boolean | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            product_offers: {
                Row: {
                    id: string
                    product_id: string
                    merchant_name: 'amazon' | 'thomann' | 'ldlc' | 'bhphoto' | 'woodbrass' | 'direct'
                    merchant_logo_url: string | null
                    price: number
                    original_price: number | null
                    currency: string | null
                    affiliate_link: string
                    in_stock: boolean | null
                    stock_quantity: number | null
                    shipping_info: string | null
                    priority: number | null
                    last_checked_at: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    product_id: string
                    merchant_name: 'amazon' | 'thomann' | 'ldlc' | 'bhphoto' | 'woodbrass' | 'direct'
                    merchant_logo_url: string | null
                    price: number
                    original_price?: number | null
                    currency?: string | null
                    affiliate_link: string
                    in_stock?: boolean | null
                    stock_quantity?: number | null
                    shipping_info?: string | null
                    priority?: number | null
                    last_checked_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    product_id?: string
                    merchant_name?: 'amazon' | 'thomann' | 'ldlc' | 'bhphoto' | 'woodbrass' | 'direct'
                    merchant_logo_url?: string | null
                    price?: number
                    original_price?: number | null
                    currency?: string | null
                    affiliate_link?: string
                    in_stock?: boolean | null
                    stock_quantity?: number | null
                    shipping_info?: string | null
                    priority?: number | null
                    last_checked_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
        }
        Views: {
            [_: string]: {
                Row: {
                    [key: string]: Json | undefined
                }
            }
        }
        Functions: {
            [_: string]: {
                Args: {
                    [key: string]: Json | undefined
                }
                Returns: Json
            }
        }
        Enums: {
            [_: string]: string
        }
    }
}
