import * as trpc from '@trpc/server';
import * as z from 'zod';

const router = trpc.router();

router.query('getUser', {
    input: z.object({
        text: z.string(),
    }),
    resolve({ input }) {
        return {
            greeting: `hello ${input.text}`
        }
    }
});


router.mutation('createUser', {
    input: z.object({
        name: z.string(),
    }),
    resolve({input}) {
        console.log('creating user ...');
        return {
            foo: input.name,
        }
    }
})

export type AppRouter = typeof router;