function Food({ position, type }) {
    return (
        type === "food" ? (
            <div
                style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#339933",
                    margin: "5px",
                    position: "absolute",
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: 1,
                }}
            />
        ) : (
            <div
                style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#ff0000", // Use a valid hex color code for red
                    margin: "5px",
                    position: "absolute",
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    zIndex: 1,
                }}
            />
        )
    );
}

export default Food;