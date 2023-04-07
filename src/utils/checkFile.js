export function isImageUrl(url) {
    const format = ['jpg','jpeg','png','gif','svg']
    return format.some((dat) => {
        return url.includes(`.${dat}`)
    })
}

export function isVideoUrl(url) {
    const format = ['mp4','ogg','webm']
    return format.some((dat) => {
        return url.includes(`.${dat}`)
    })
}