import { v4 } from "uuid";

export interface AuditService {
  audit(oldObj: Entity, newObj: Entity): Promise<void>;
}

export interface EntityRepository {
  get(id: string): Promise<Entity>;
  save(entity: Entity): Promise<boolean>;
}

export class Entity {
  auditService: AuditService;
  repository: EntityRepository;
  doctype: string;
  id: string;
  rev: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  old: Entity;

  constructor(
    doctype: string,
    auditService: AuditService,
    repository: EntityRepository
  ) {
    this.doctype = doctype;
    this.auditService = auditService;
    this.repository = repository;
  }

  setValues(values: any) {
    Object.assign(this, values);
  }

  async load(id: string) {
    const entity = await this.repository.get(id);
    this.old = Object.assign({}, entity);
    this.setValues(entity);
  }

  async save() {
    this.id = this.id || v4();
    this.rev = this.rev || v4();
    this.createdAt = this.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    await this.auditService.audit(this.old, this);
    await this.repository.save(this);
  }
}
