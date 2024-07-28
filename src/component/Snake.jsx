

function Snake({ snake }) {
    return (
        <div>
            {
                snake.map((box, i) => (
                    <div style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: (i===snake.length-1) ? "#ffff00" : "#4d4d00",
                        margin: "5px",
                        position: "absolute",
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        border: (i===snake.length-1) ? "1px solid gray" : "1px solid black", 
                        zIndex: 1,
                    }} />
                ))
            }
        </div>
    )
}

export default Snake;