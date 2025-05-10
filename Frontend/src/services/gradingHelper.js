const getGrade = (score, maxScore) => {
    let percent = score / maxScore;
    if (percent >= 0.9) return 5;
    if (percent >= 0.75) return 4;
    if (percent >= 0.6) return 3;
    return 2;
}

export default getGrade;
