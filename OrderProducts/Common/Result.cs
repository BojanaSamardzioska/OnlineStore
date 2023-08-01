namespace OrderProducts.Common;

public class Result<T>
{
    public T? Data { get; set; }

    public bool IsSuccess { get; set; }

    public string? Message { get; set; }
    public string? Error { get; set; }

    public static Result<T> Success(T data, string? message = null) => new()
    {
        IsSuccess = true,
        Data = data,
        Message = message
    };

    public static Result<T> Failure(string error) => new()
    {
        IsSuccess = false,
        Error = error
    };
}

public class Result
{
    public bool IsSuccess { get; set; }
    public string? Error { get; set; }
    public string? Message { get; set; }

    public static Result Success(string? message = null) => new()
    {
        IsSuccess = true,
        Message = message
    };

    public static Result Failure(string error) => new()
    {
        IsSuccess = false,
        Error = error
    };
}