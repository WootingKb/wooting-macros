import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

type Props = {
    id:number
    text:string,
}

const Sortable = (props: Props) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.text}
        </li>
    );
}

export default Sortable