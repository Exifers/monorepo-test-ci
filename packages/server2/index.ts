import fastify, {RouteShorthandOptions} from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import z, {ZodType} from "zod";
import {
    ContextConfigDefault,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerDefault
} from "fastify/types/utils";
import {FastifySchema} from "fastify/types/schema";
import * as repl from "repl";

const aa = z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number().transform(a => a.toString()),
});

type AAT = z.infer<typeof aa>;
type AATInput = z.input<typeof aa>;
type AATOuput = z.output<typeof aa>;

const a: AATInput = {
    name: 'dedew',
    email: 'dewdew',
    age: 12,
}

const b: AATOuput = {
    name: 'dedew',
    email: 'dewdew',
    age: '12',
}


const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
const PORT = 3001;

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const QueryString = z.object({
    ccc: z.string().min(4).email().transform(s => 1),
});

export type QueryStringT = z.infer<typeof QueryString>;

const Body = z.object({
    abc: z.string(),
})

export type BodyT = z.infer<typeof Body>;

interface ZodSchema extends FastifySchema {
    body?: ZodType;
    querystring?: ZodType<any, any, any>;
    params?: ZodType;
    headers?: ZodType;
    response?: ZodType;
}

type RouteOptions<RouteInterface, Schema = FastifySchema> = RouteShorthandOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteInterface,
    ContextConfigDefault,
    Schema,
    ZodTypeProvider
>

interface RouteOptions2<Q, B, R> {
    schema: {
        querystring: Q,
        body: B,
    }
}

const getOpts = <Q extends ZodType, B extends ZodType>(querystring: Q, body: B): RouteOptions<{Querystring: z.infer<Q>}> => ({
    schema: {
        querystring,
        body,
    }
})

app.get('/', getOpts(QueryString, Body), (request, reply) => {
    console.log(request.query.ccc);
    reply.send(12);
});

const opts = {
    schema: {
        querystring: z.object({
            goodbye: z.string()
        }),
        params: z.object({
            hello: z.string()
        }),
        body: z.object({
            name: z.string(),
        }),
        response: z.object({
            '2xx': z.string(),
        })
    }
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type ZodRouteOptions = WithRequired<RouteOptions<{Querystring: ZodType}, ZodSchema>, 'schema'>;

const typeOpts = <T extends ZodRouteOptions>(opts: T) => opts as unknown as RouteOptions<{
    Querystring: T['schema']['querystring'] extends ZodType<any, any, any> ? z.output<T['schema']['querystring']> : never;
    Params: T['schema']['params'] extends ZodType<any, any, any> ? z.output<T['schema']['params']> : never;
    Body: T['schema']['body'] extends ZodType<any, any, any> ? z.output<T['schema']['body']> : never;
    Response: T['schema']['response'] extends ZodType<any, any, any> ? z.input<T['schema']['response']> : never;
}>

const q = z.object({b: z.string()});
type Q = typeof q;
type Qs = z.infer<Q>;

const out = typeOpts(opts);

app.get(
    '/message/:message',
    typeOpts(opts),
    async (request, reply) => {
        console.log(request.query.goodbye);
        console.log(request.params.hello);
        console.log(request.body.name.toUpperCase());
        reply.send({a: 12});
    },
)

app.listen({port: PORT}, () => {
    console.log(`listening on port ${PORT}`);
});
