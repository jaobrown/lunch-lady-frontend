const ErrorMessage = ({ error }) => {
  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <div key={i}>
        <p data-test="graphql-error" className="text-red-600">
          <strong>Shoot!</strong> {error.message.replace("GraphQL error: ", "")}
        </p>
      </div>
    ));
  }
  return (
    <div>
      <p data-test="graphql-error" className="text-red-600">
        <strong>Shoot!</strong> {error.message.replace("GraphQL error: ", "")}
      </p>
    </div>
  );
};

export default ErrorMessage;
