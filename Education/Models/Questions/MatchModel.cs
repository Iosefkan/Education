namespace Education.Models.Questions;

public class MatchModel
{
    public List<MatchOption> Matches { get; set; }
    public string Text { get; set; }
}

public class MatchOption
{
    public MatchHalf Left { get; set; }
    public MatchHalf Right { get; set; }
}

public class MatchHalf
{
    public string Id { get; set; }
    public string Text { get; set; }
}