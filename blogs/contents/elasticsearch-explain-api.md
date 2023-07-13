## Do you want to understand why your documents got those scores?

### Documents

Let’s go through the Explain API with a set of example documents. In my case I am going to use a small list of movie quotes.

```
POST _bulk
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "The Incredibles", "quote": "Never look back, darling. It distracts from the now" }
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "The Lion King", "quote": "Oh yes, the past can hurt. But, you can either run from it or learn from it" }
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "Toy Story", "quote": "To infinity and beyond" }
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "Ratatouille", "quote": "You must not let anyone define your limits because of where you come from" }
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "Lilo and Stitch", "quote": "Ohana means family, family means nobody gets left behind. Or forgotten" }
```

### BM25

The [BM25 algorithm](https://en.wikipedia.org/wiki/Okapi_BM25), the default algorithm for scoring in elasticsearch.

$$score = \frac{boost \times freq \times log(1 + \frac{(N - n + 0.5)}{(n + 0.5)})}{(freq + k1 * (1 - b + b * \frac{dl}{avgdl}))}$$

* `boost` - constant 2.2 = `(k1 + 1)`, ignore, not relevant for ordering
* `freq` - the number of times this term appears in the field
* `N` - the total number of documents in the shard
* `n` - the number of documents that contain this term
* `k1` - constant 1.2, term saturation parameter, can be changed
* `b` - constant 0.75, length normalization parameter, can be changed
* `dl` - length of the field, specifically the number of terms in the field
* `avgdl` - the average length of this field for every document in the cluster

### Example 1: Fields with less terms are more important.

```
GET movie_quotes/_search
{
  "explain": true,
  "query": {
    "match": {
      "quote": "the"
    }
  }
}
```

#### Response

```
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.94581884,
    "hits": [
      {
        "_shard": "[movie_quotes][0]",
        "_node": "M9Dx5c1BTk6ehVVSCiJAvQ",
        "_index": "movie_quotes",
        "_id": "LMpi64YBn8MlrX4RQHf9",
        "_score": 0.94581884,
        "_source": {
          "title": "The Incredibles",
          "quote": "Never look back, darling. It distracts from the now"
        },
        "_explanation": {
          "value": 0.94581884,
          "description": "weight(quote:the in 0) [PerFieldSimilarity], result of:",
          "details": [
            {
              "value": 0.94581884,
              "description": "score(freq=1.0), computed as boost * idf * tf from:",
              "details": [
                {
                  "value": 2.2,
                  "description": "boost",
                  "details": []
                },
                {
                  "value": 0.87546873,
                  "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                  "details": [
                    {
                      "value": 2,
                      "description": "n, number of documents containing term",
                      "details": []
                    },
                    {
                      "value": 5,
                      "description": "N, total number of documents with field",
                      "details": []
                    }
                  ]
                },
                {
                  "value": 0.4910714,
                  "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                  "details": [
                    {
                      "value": 1,
                      "description": "freq, occurrences of term within document",
                      "details": []
                    },
                    {
                      "value": 1.2,
                      "description": "k1, term saturation parameter",
                      "details": []
                    },
                    {
                      "value": 0.75,
                      "description": "b, length normalization parameter",
                      "details": []
                    },
                    {
                      "value": 9,
                      "description": "dl, length of field",
                      "details": []
                    },
                    {
                      "value": 11,
                      "description": "avgdl, average length of field",
                      "details": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        "_shard": "[movie_quotes][0]",
        "_node": "M9Dx5c1BTk6ehVVSCiJAvQ",
        "_index": "movie_quotes",
        "_id": "Lcpi64YBn8MlrX4RQHf9",
        "_score": 0.71575475,
        "_source": {
          "title": "The Lion King",
          "quote": "Oh yes, the past can hurt. But, you can either run from it or learn from it"
        },
        "_explanation": {
          "value": 0.71575475,
          "description": "weight(quote:the in 1) [PerFieldSimilarity], result of:",
          "details": [
            {
              "value": 0.71575475,
              "description": "score(freq=1.0), computed as boost * idf * tf from:",
              "details": [
                {
                  "value": 2.2,
                  "description": "boost",
                  "details": []
                },
                {
                  "value": 0.87546873,
                  "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                  "details": [
                    {
                      "value": 2,
                      "description": "n, number of documents containing term",
                      "details": []
                    },
                    {
                      "value": 5,
                      "description": "N, total number of documents with field",
                      "details": []
                    }
                  ]
                },
                {
                  "value": 0.3716216,
                  "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                  "details": [
                    {
                      "value": 1,
                      "description": "freq, occurrences of term within document",
                      "details": []
                    },
                    {
                      "value": 1.2,
                      "description": "k1, term saturation parameter",
                      "details": []
                    },
                    {
                      "value": 0.75,
                      "description": "b, length normalization parameter",
                      "details": []
                    },
                    {
                      "value": 17,
                      "description": "dl, length of field",
                      "details": []
                    },
                    {
                      "value": 11,
                      "description": "avgdl, average length of field",
                      "details": []
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

#### Detailed Description

For the document that came first, The Incredibles, we get the score `0.94581884`, calculated as follows:

$$0.94581884 = \frac{2.2 \times 1 \times log(1 + \frac{(5 - 2 + 0.5)}{(2 + 0.5)})}{(1 + 1.2 * (1 - 0.75 + 0.75 * \frac{9}{11}))}$$

For the second document, The Lion King, we get `0.71575475`, calculated as follows

$$0.71575475 = \frac{2.2 \times 1 \times log(1 + \frac{(5 - 2 + 0.5)}{(2 + 0.5)})}{(1 + 1.2 * (1 - 0.75 + 0.75 * \frac{17}{11}))}$$

For this example the equation is almost exactly the same, the only difference is in the second document, the field is longer by 2 terms, the algorithm has been designed in a way that means this document is less important because it has more terms in total. The reasoning behind this; the shorter the field that contains the term, the more real estate has been used for the term so it must be more valuable.

### Example 2: Higher frequency of a term in a field is more important.

```
GET movie_quotes/_search
{
  "explain": true,
  "query": {
    "match": {
      "quote": "you"
    }
  }
}
```

#### Detailed Description

Skipping the full output this time, for the document that came first, Ratatouille, we get the score `1.1180129`, calculated as follows:

$$1.1180129= \frac{2.2 \times 2 \times log(1 + \frac{(5 - 2 + 0.5)}{(2 + 0.5)})}{(2 + 1.2 * (1 - 0.75 + 0.75 * \frac{14}{11}))}$$

For the second document, The Lion King, we get `0.71575475`, calculated as follows

$$0.71575475 = \frac{2.2 \times 1 \times log(1 + \frac{(5 - 2 + 0.5)}{(2 + 0.5)})}{(1 + 1.2 * (1 - 0.75 + 0.75 * \frac{17}{11}))}$$

For this example the equation is very similar again, but the documents have very different scores, more so than the shorter field example. The differences now are in frequency and field length, the field length in the first document is shorter, and the term frequency is higher, the field length is important to a point, but the frequency is more important up to a point, see next example. We also see that the second document has the same score as the first document in the previous example, this is because the circumstances are the same, the same frequency and the same field length, in fact it is the same document.

### Example 3: Messing with the algorithm

If the term frequency is so important, can I just make sure my document always comes to the top by repeating the same term over and over?

```
POST _bulk
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "Movie 1", "quote": "Movie movie movie movie." }
{ "index" : { "_index" : "movie_quotes" } }
{ "title" : "Movie 2", "quote": "Movie movie movie movie movie movie movie movie." }
```

```
GET movie_quotes/_search
{
  "explain": true,
  "query": {
    "match": {
      "quote": "movie"
    }
  }
}
```

#### Description

For Movie 2, we get `2.2614799` and for Movie 1 we get `2.1889362`. These 2 scores are very similar now, the reason is that the `freq` is in the numerator and the denominator at first, as the frequency of the term increases the score boosts fast, but when the frequency gets to high, it becomes less and less relevant, even though the Movie 2 document has double the frequency of terms.

### Conclusion

These are short examples with a simple match query and we have not seen the interplay of every possible condition yet, but even so this is a good starting point to really get to grips with the scores that our documents get and to understand how to start tuning our documents to take advantage of this algorithm. It is necessary to mention and understand at this point that the exact value of the score is irrelevant, the relative score is the only thing useful for ordering. Some further examples to try out on your own;

* Really long fields that contain the term many times, less relevant than short fields with the term only a few times.
* Terms that appear in every document bringing too many documents back, like `the`, `an` or `a`, also called stop words. This sample set is too small to really see how stop words can really affect the number of documents returned. 
* As this is a movie database, you might find a completely new set of stop words specific to movies, like `film`, `movie`, `flick`, `actor`, `camera` and so on. With a larger movie database you will find that searching for some of these terms will bring back results with the wrong relevance.
* Increasing the complexity of the query by adding more parameters to the request, like searching for multiple terms in multiple fields, or looking for the same term in multiple fields or looking for different terms in multiple fields.
* Begin exploring the different query types from the [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html), Especially the [Boolean Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html) which really starts to bring out the power of relevancy tuning in Elasticsearch.
