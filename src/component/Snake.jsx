

function Snake({ snake }) {
    return (
        <div>
            {
                snake.map((box, i) => (
                    <div style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: "#e7da3d",
                        margin: "5px",
                        position: "absolute",
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        zIndex: 1,
                    }} />
                ))
            }
        </div>
    )
}

export default Snake;