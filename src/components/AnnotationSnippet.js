export default function AnnotationSnippet({annot_id, annotation, onSelectAnnotation}) {
    return (
        <div className={`annotation-snippet ${annotation.selected ? 'selection' : ''}`}
             onClick={() => onSelectAnnotation(annot_id)}>
            {annotation.entity_type}: {annotation.entity_text}
        </div>
    )
}
