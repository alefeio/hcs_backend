import Blog from '../models/Blog';
import File from '../models/File';

class BlogController {
  async store(req, res) {
    if (!req.usuarioAdmin) {
      return res.status(401).json({ erro: 'Operação não autorizada!' });
    }

    const {
      titulo,
      descricao,
      texto,
      autor,
      img_id,
    } = req.body;

    const blogExiste = await Blog.findOne({ where: { titulo } });

    if (blogExiste) {
      return res.status(400).json({ erro: 'Post já existe!' });
    }

    const usuario_id = req.usuarioId;

    const blog = await Blog.create({
      titulo,
      descricao,
      texto,
      autor,
      usuario_id,
      img_id,
    });

    return res.json(blog);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const blog = await Blog.findAll({
      where: { ativo: true },
      attributes: [
        'id',
        'titulo',
        'descricao',
        'texto',
        'autor',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(blog);
  }

  async detail(req, res) {
    const busca = req.params.id;

    const blog = await Blog.findOne({
      where: { id: busca, ativo: true },
      attributes: [
        'id',
        'titulo',
        'descricao',
        'texto',
        'autor',
      ],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(blog);
  }

  async update(req, res) {
    if (!req.usuarioAdmin) {
      return res.status(401).json({ erro: 'Operação não autorizada!' });
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(400).json({ erro: 'Não encontrado!' });
    }

    await blog.update(req.body);

    return res.json({ blog });
  }

  async delete(req, res) {
    if (!req.usuarioAdmin) {
      return res.status(401).json({ erro: 'Operação não autorizada!' });
    }

    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(400).json({ erro: 'Não encontrado!' });
    }

    blog.ativo = false;

    blog.save();

    return res.json(blog);
  }
}

export default new BlogController();
