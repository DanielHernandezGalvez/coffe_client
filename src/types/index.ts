import {z} from 'astro:content'
import { slash } from 'node_modules/astro/dist/core/path'

const imageSchema = z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
})

const featureImagesSchema = z.object({
    thumbnail: imageSchema,
    medium: imageSchema,
    medium_large: imageSchema,
    large: imageSchema,
    full: imageSchema
})

export const BaseWPSchema =  z.object({
    id: z.number(),
    slug: z.string(),
    title: z.object({
        rendered: z.string()
    }),
     content: z.object({
        rendered: z.string()
    }),
    featured_images: featureImagesSchema,
    acf: z.object({
        subtitle: z.string()
    })
})

const gallerySchema = z.object({
    large: imageSchema,
    full: imageSchema
})

export const GalleryPageSchema = BaseWPSchema.extend({
    gallery: z.array(gallerySchema)
})

const processSchema = z.object({
    titulo: z.string(),
    descripcion: z.string(),
    image: z.string()
})

export const ProcessPageSchema = BaseWPSchema.extend({
    acf: z.object({
        subtitle: z.string()
    }).catchall(processSchema)
})

/* schema blog post */

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
})
export const CategoriesSlugSchema = z.array(CategorySchema.pick({
    slug: true
}))
const CategoriesSchema = z.array(CategorySchema)

export const Postchema = BaseWPSchema.omit({
    acf: true // esto va a tomar todas las porpiedades del basewpschema menos acf
}).extend({
    date: z.string(),
    category_details: CategoriesSchema
})

export const PostsSchema = z.array(Postchema)

// menu
const MenuItemSchema = BaseWPSchema.pick({
title: true,
featured_images: true,
}).extend({
    acf: z.object({
        description: z.string(),
        price: z.coerce.number()
    })
})
export const MenuItemsSchema = z.array(MenuItemSchema)

// map
const MarkerSchema = z.object({
    label: z.string(),
    lat: z.number(),
    lng: z.number()
})

const LocationSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    zoom: z.number(),
    markers: z.array(MarkerSchema)
})

export const ContactPageSchema = BaseWPSchema.extend({
     acf: z.object({
        subtitle: z.string()
    }).catchall(LocationSchema)
})

export type Post = z.infer<typeof Postchema>
export type Gallery = z.infer<typeof gallerySchema>
export type FeatureImages = z.infer<typeof featureImagesSchema>
export type Location = z.infer<typeof LocationSchema>