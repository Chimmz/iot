import { Card} from "react-bootstrap";

export const CardComponent = (props) =>{
    return(
        <Card className={props.cardClassName}>
            <Card.Title>
                <div>{props.title}</div>
            </Card.Title>
            <Card.Body className='ps-0'>
                <div className={props.headerClassName}>{props.bodyHeader}</div>
                { props.cardBodyContent
                    ?
                        Object.keys(props.cardBodyContent).map((index, key)=>
                            (<div key={key}>
                                {props.cardBodyContent[index]} 
                            </div>)
                        )                            
                    : 
                        <></> 
                }
            </Card.Body>
        </Card>
    )
}