interface JsonLdScriptProps {
  schemas: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLdScript({ schemas }: JsonLdScriptProps) {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
  return <>{schemaArray.map((schema, index) => (
    <script key={index} type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
  ))}</>;
}
