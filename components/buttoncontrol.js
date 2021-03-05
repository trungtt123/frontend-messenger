import { useRouter } from 'next/router'
function ButtonControl(props) {
    const router = useRouter();
    const handleButtonControl = () => {
        router.back();
    }
    return (
        <>
            <i className="fas fa-chevron-left" onClick={() => handleButtonControl()}/>
                    <b>{props.data}</b>
            <i className="fas fa-times" onClick={() => handleButtonControl()}/>
        </>
    )
}

export default ButtonControl;

