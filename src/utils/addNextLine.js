function AddingNextLine(input) {
    console.log(input.length);
    let nextInput = "";
    for (let i = 0; i < input.length; i++) {
        if (input[i] === ' ')
            nextInput += '\n';
        else
            nextInput += input[i];

    }
    return nextInput;
}

export default AddingNextLine;