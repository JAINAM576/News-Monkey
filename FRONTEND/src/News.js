import React, { Component } from 'react'
import Newsitem from './Newsitem';
import axios from 'axios';
import Spinner from './Spinner';
import Error from './Error';

export class News extends Component {

  constructor() {
    super();

    this.state = {
      articles: [],
      want: "",
      temp: "",
      done: "",
      loading: false,
      error: null,
      articlesPerPage: 18,
      viewMode: 'grid', // grid or list
      sortBy: 'publishedAt'
    }
  }

  async componentDidMount() {
    await this.fetchNews();
  }

  static getDerivedStateFromProps = (props, state) => {
    return { temp: state.want, want: props.want };
  }

  fetchNews = async () => {
    this.setState({ loading: true, error: null, articles: [], done: "" });
    
    try {
      const response = await axios.post(`https://news-monkey-backend.onrender.com/api/proxy`, 
        { field: this.state.want },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      const articles = response.data.message.articles || [];
      this.setState({ 
        articles: articles,
        loading: false 
      });

      // Set done state if no articles found
      if (articles.length === 0) {
        setTimeout(() => {
          this.setState({ done: 'done' });
        }, 2000);
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      this.setState({ 
        error: error.response?.data?.detail || 'Failed to fetch news. Please try again.',
        loading: false,
        done: 'done'
      });
    }
  }

  handleRefresh = () => {
    this.fetchNews();
  }

  jainam = () => {
    if (this.state.temp !== this.state.want) {
      this.setState({ done: "" });
      this.fetchNews();
    }
  }

  handleViewModeChange = (mode) => {
    this.setState({ viewMode: mode });
  }

  handleSortChange = (sortBy) => {
    this.setState({ sortBy });
  }

  getSortedArticles = () => {
    const { articles, sortBy } = this.state;
    const filteredArticles = articles.filter(art => art.urlToImage && art.title && art.description);
    
    return filteredArticles.sort((a, b) => {
      if (sortBy === 'publishedAt') {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  renderGridView = () => {
    const sortedArticles = this.getSortedArticles();
    const { articlesPerPage, viewMode } = this.state;
    const { checked } = this.props;
    
    const colClass = viewMode === 'grid' ? 'col-xl-4 col-lg-6 col-md-6' : 'col-12';
    
    return sortedArticles
      .slice(0, articlesPerPage)
      .map((art, index) => (
        <div key={`${art.url}-${index}`} className={`${colClass} mb-4`}>
          <div className="h-100 news-card-wrapper">
            <Newsitem 
              title={art.title} 
              descrip={art.description} 
              imgurl={art.urlToImage} 
              url={art.url} 
              checking={checked}
              publishedAt={art.publishedAt}
              source={art.source?.name}
              viewMode={viewMode}
            />
          </div>
        </div>
      ));
  }

  renderEmptyState = () => {
    const { checked } = this.props;
    return (
      <div className="text-center py-5">
        <div className="empty-state-container">
          <div className="mb-4">
            <i className="fas fa-newspaper fa-4x text-muted opacity-50"></i>
          </div>
          <h3 className={`mb-3 ${checked === 'black' ? 'text-light' : 'text-dark'}`}>
            No Articles Found
          </h3>
          <p className="text-muted mb-4 lead">
            We couldn't find any articles matching your search. Try a different topic or refresh to see the latest news.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <button 
              className="btn btn-primary btn-lg px-4"
              onClick={this.handleRefresh}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh News
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-home me-2"></i>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderLoadingState = () => {
    return (
      <div className="text-center py-5">
        <div className="loading-container">
          <Spinner />
          <h4 className="mt-4 text-muted">Fetching Latest News...</h4>
          <p className="text-muted">Please wait while we gather the best articles for you</p>
          <div className="progress mx-auto mt-3" style={{ width: '300px', height: '4px' }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  renderErrorState = () => {
    const { error } = this.state;
    return (
      <div className="text-center py-5">
        <div className="error-state-container">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle fa-4x text-warning"></i>
          </div>
          <h3 className="mb-3 text-danger">Oops! Something went wrong</h3>
          <p className="text-muted mb-4 lead">{error}</p>
          <div className="d-flex gap-3 justify-content-center">
            <button 
              className="btn btn-danger btn-lg px-4"
              onClick={this.handleRefresh}
            >
              <i className="fas fa-redo me-2"></i>
              Try Again
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-refresh me-2"></i>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    this.jainam();
    
    const { checked, topic } = this.props;
    const { articles, loading, error, done, viewMode, articlesPerPage } = this.state;
    
    const sortedArticles = this.getSortedArticles();
    const hasArticles = sortedArticles.length > 0;
    
    const headerStyle = {
      background: checked === 'black' 
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '15px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    };

    return (
      <>
        <style jsx>{`
          .news-card-wrapper {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .news-card-wrapper:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
          .control-panel {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          }
          .stats-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 15px;
            padding: 1.5rem;
            margin-top: 2rem;
          }
          .empty-state-container, .loading-container, .error-state-container {
            padding: 3rem;
            border-radius: 15px;
            background: rgba(248,249,250,0.8);
            backdrop-filter: blur(10px);
          }
          .btn-group-modern .btn {
            border-radius: 25px;
            margin: 0 2px;
            transition: all 0.3s ease;
          }
          .btn-group-modern .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
        `}</style>

        <div className="container-fluid px-4 py-3">
          {/* Hero Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div style={headerStyle} className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <i className="fas fa-newspaper fa-3x me-3"></i>
                  <div>
                    <h1 className="display-4 fw-bold mb-0">NewsMaster</h1>
                    <p className="lead mb-0 opacity-75">Your Gateway to Global News</p>
                  </div>
                </div>
                
                <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                  <span className="badge bg-light text-dark fs-6 px-3 py-2 rounded-pill">
                    <i className="fas fa-tag me-2"></i>
                    {topic || 'Latest News'}
                  </span>
                  {hasArticles && (
                    <span className="badge bg-success fs-6 px-3 py-2 rounded-pill">
                      <i className="fas fa-check-circle me-2"></i>
                      {sortedArticles.length} Articles Found
                    </span>
                  )}
                  <span className="badge bg-info fs-6 px-3 py-2 rounded-pill">
                    <i className="fas fa-clock me-2"></i>
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          {!loading && hasArticles && (
            <div className="row">
              <div className="col-12">
                <div className="control-panel">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center gap-3">
                        <h6 className="mb-0 text-muted">
                          <i className="fas fa-sliders-h me-2"></i>
                          Display Options
                        </h6>
                        <div className="btn-group btn-group-modern" role="group">
                          <button 
                            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => this.handleViewModeChange('grid')}
                          >
                            <i className="fas fa-th me-1"></i>Grid
                          </button>
                          <button 
                            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => this.handleViewModeChange('list')}
                          >
                            <i className="fas fa-list me-1"></i>List
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center justify-content-md-end gap-3">
                        <div className="dropdown">
                          <button 
                            className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="fas fa-sort me-1"></i>
                            Sort by
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => this.handleSortChange('publishedAt')}
                              >
                                <i className="fas fa-clock me-2"></i>Latest First
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => this.handleSortChange('title')}
                              >
                                <i className="fas fa-sort-alpha-down me-2"></i>Alphabetical
                              </button>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="dropdown">
                          <button 
                            className="btn btn-outline-secondary btn-sm dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown"
                          >
                            <i className="fas fa-eye me-1"></i>
                            Show {articlesPerPage}
                          </button>
                          <ul className="dropdown-menu">
                            {[12, 18, 24, 30].map(count => (
                              <li key={count}>
                                <button 
                                  className="dropdown-item"
                                  onClick={() => this.setState({ articlesPerPage: count })}
                                >
                                  Show {count} articles
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={this.handleRefresh}
                          disabled={loading}
                        >
                          <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="row">
            <div className="col-12">
              {loading && this.renderLoadingState()}
              
              {error && !loading && this.renderErrorState()}
              
              {!loading && !error && !hasArticles && done === 'done' && this.renderEmptyState()}
              
              {!loading && !error && hasArticles && (
                <div className="row g-4" 
                style={{"marginLeft":"10%"}}>
                  {this.renderGridView()}
                </div>
              )}
            </div>
          </div>

          {/* Stats Footer */}
          {!loading && hasArticles && (
            <div className="row">
              <div className="col-12">
                <div className="stats-card text-center">
                  <div className="row">
                    <div className="col-md-3 col-6 mb-3 mb-md-0">
                      <i className="fas fa-newspaper fa-2x mb-2 opacity-75"></i>
                      <h4 className="mb-0">{articles.length}</h4>
                      <small className="opacity-75">Total Articles</small>
                    </div>
                    <div className="col-md-3 col-6 mb-3 mb-md-0">
                      <i className="fas fa-images fa-2x mb-2 opacity-75"></i>
                      <h4 className="mb-0">{sortedArticles.length}</h4>
                      <small className="opacity-75">With Images</small>
                    </div>
                    <div className="col-md-3 col-6">
                      <i className="fas fa-eye fa-2x mb-2 opacity-75"></i>
                      <h4 className="mb-0">{Math.min(articlesPerPage, sortedArticles.length)}</h4>
                      <small className="opacity-75">Currently Showing</small>
                    </div>
                    <div className="col-md-3 col-6">
                      <i className="fas fa-clock fa-2x mb-2 opacity-75"></i>
                      <h4 className="mb-0">Live</h4>
                      <small className="opacity-75">Real-time Updates</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default News
