const transformQuestionEditorToQuestion = (question) => {
    let result;
    switch (question.type){
        case 1:
            result = {
                type: question.type,
                questionText: question.text,
                options: question.answers
            }
            break;
        case 2:
            result = {
                type: question.type,
                questionText: question.text,
                options: question.answers.map((answ) => {
                    return { id: answ.id, text: answ.text }
                })
            }
            break;
        case 3:
            result = {
                type: question.type,
                questionText: question.text,
                leftItems: question.matches.map((match) => match.left),
                rightItems: question.matches.map((match) => match.right)
            };
            break;
        case 4:
            result = {
                type: question.type,
                questionText: question.text,
            }
            break;
    }
    console.log(question);
    console.log(result);
    return result;
}

export default transformQuestionEditorToQuestion;