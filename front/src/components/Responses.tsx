import { Params } from "react-router-dom";
import { Book } from "../models/book"
import { getImageSize } from 'react-image-size'

export const emptyId = new Response(`Empty ID`, { status: 404 })
export const invalidId = (id: number) => new Response(`Invalid ID: '${id}'`, { status: 404 })
export const missingId = (id: number) => new Response(`Missing ID: '${id}'`, { status: 404 })

export function validateId(idString: string) {
    const id = Number.parseInt(idString);
    if (Number.isNaN(id)) {
        throw invalidId(id)
    }
    return id
}

export async function fetchBook(id: number, url: string) {
    const resp = await fetch(url, {
        method: "GET",
        headers: new Headers({ "cont.ent-type": "application/json" }),
    })

    if (resp.status == 404) {
        throw missingId(id)
    }

    return await resp.json() as Book
}

export async function getBook(id: string | undefined): Promise<Book> {
    if (!id) { throw emptyId }
    const bookId = validateId(id)
    const url = `${import.meta.env.VITE_API_PREFIX}/book/${bookId}`;
    return await fetchBook(bookId, url)
}

export async function bookLoader({ params }: { params: Params<string> }) { return getBook(params.id) }

export async function fetchImage(id: number) {
    const imageUrl = `${import.meta.env.VITE_API_PREFIX}/covers/${id}.jpg`;
    const dimensions = await getImageSize(imageUrl)
    const maxHeight = 375;
    return {
        height: maxHeight,
        width: maxHeight / dimensions.height * dimensions.width,
    }
}