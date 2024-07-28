
function Food({ position }) {
    return (
        <div
            style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#3dd1e7",
                margin: "5px",
                position: "absolute",
                left: `${position.x}%`,
                top: `${position.y}%`,
                zIndex: 0,
            }}
        />
    )
}

export default Food;