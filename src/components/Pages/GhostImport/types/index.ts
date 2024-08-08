export type Post = {
	id: string
	title: string
	plaintext: string
	slug: string
	published_at: string
	feature_image: string | null
}

type DBReturnType = {
	data: {
		posts: Post[]
	}
	meta: {}
}

export type JSONDataReturnType = {
	db: DBReturnType[]
}
